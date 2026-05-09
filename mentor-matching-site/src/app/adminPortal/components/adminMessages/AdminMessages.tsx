/**
 * AdminMessages.tsx — Admin messaging hub
 *
 * Combines:
 *  • Internal messaging (view any user's inbox/sent, send as admin, delete)
 *  • Outbound email (Firebase Trigger Email extension)
 *
 * Layout mirrors Messages.tsx on aimees-branch:
 *  Dark sidebar → message list panel → detail pane
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { Timestamp } from 'firebase/firestore';

import { messagingService } from '../../../../service/messagingService';
import { sendEmail } from '../../../../service/mailService';
import { useAppSelector } from '../../../../redux/hooks';
import { DocItem } from '../../../../types/types';
import { MentorReply, Message } from '../../../../types/matchProfile';
import { UserProfile } from '../../../../types/userProfile';
import userService from '../../../../service/userService';

/* ── Brand colours (matches Messages.tsx on aimees-branch) ── */
const OSU_ORANGE   = '#DC4405';
const SIDEBAR_BG   = '#1a1a1a';
const SIDEBAR_TEXT = '#f5f5f5';
const PANEL_BG     = '#fafafa';
const BORDER_COLOR = '#e0e0e0';
const UNREAD_ACCENT  = '#fff8f5';
const SELECTED_BG    = '#fff3ee';

type AdminSection = 'inbox' | 'sent' | 'compose' | 'email';

/* ── helpers ── */
function formatDate(raw: any): string {
  if (!raw) return '';
  try {
    const d: Date = typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw);
    const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays < 7)  return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch { return ''; }
}

function fullDate(raw: any): string {
  if (!raw) return '';
  try {
    const d: Date = typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw);
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return ''; }
}

function initials(name: string): string {
  return (name || '?').split(' ').map((w) => w[0] ?? '').slice(0, 2).join('').toUpperCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/* ══════════════════════════════════════════════
   Component
══════════════════════════════════════════════ */
function AdminMessages() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const adminProfile = useAppSelector((state) => state.userProfile.userProfile);

  /* ── global ── */
  const [allUsers, setAllUsers]         = useState<UserProfile[]>([]);
  const [avatarCache, setAvatarCache]   = useState<Record<string, string>>({});
  const [section, setSection]           = useState<AdminSection>('inbox');
  const [showDetail, setShowDetail]     = useState(false);
  const [globalError, setGlobalError]   = useState('');

  /* ── message viewer ── */
  const [viewingUser, setViewingUser]   = useState<UserProfile | null>(null);
  const [inbound, setInbound]           = useState<DocItem<Message>[]>([]);
  const [sent, setSent]                 = useState<DocItem<Message>[]>([]);
  const [selected, setSelected]         = useState<DocItem<Message> | null>(null);
  const [search, setSearch]             = useState('');
  const [loading, setLoading]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  /* ── compose (internal) ── */
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeBody, setComposeBody]           = useState('');
  const [composeSending, setComposeSending]     = useState(false);
  const [composeError, setComposeError]         = useState('');
  const [composeSent, setComposeSent]           = useState(false);

  /* ── email ── */
  const [emailTo, setEmailTo]           = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody]       = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent]       = useState(false);
  const [emailError, setEmailError]     = useState('');

  /* ── load all users once ── */
  useEffect(() => {
    userService.getAllUserProfiles()
      .then((users) => {
        setAllUsers(users);
        Promise.all(
          users.map(async (u) => {
            try {
              const p = await userService.getUserProfile(u.UID);
              return p?.imageUrl ? { uid: u.UID, url: p.imageUrl } : null;
            } catch { return null; }
          })
        ).then((results) => {
          const cache: Record<string, string> = {};
          results.forEach((r) => { if (r) cache[r.uid] = r.url; });
          setAvatarCache(cache);
        });
      })
      .catch(() => setGlobalError('Failed to load user list.'));
  }, []);

  /* ── load messages for selected user ── */
  const loadMessages = useCallback(async (user: UserProfile) => {
    setLoading(true);
    setGlobalError('');
    try {
      const [inboundMsgs, sentMsgs] = await Promise.all([
        messagingService.getMessagesSentToUser(user.UID),
        messagingService.getMessagesSentByUser(user.UID),
      ]);
      setInbound(inboundMsgs);
      setSent(sentMsgs);
    } catch {
      setGlobalError('Could not load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUserSelect = (e: SelectChangeEvent<string>) => {
    const uid = e.target.value;
    const found = allUsers.find((u) => u.UID === uid) ?? null;
    setViewingUser(found);
    setSelected(null);
    setSearch('');
    if (found) loadMessages(found);
  };

  /* ── active list for message panel ── */
  const activeList = section === 'sent' ? sent : inbound;
  const filtered = activeList.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.data.senderDisplayName?.toLowerCase().includes(q) ||
      m.data.message?.toLowerCase().includes(q)
    );
  });

  /* ── delete ── */
  const handleDelete = async () => {
    if (!deleteTarget || !viewingUser) return;
    await messagingService.deleteMessage(deleteTarget);
    if (selected?.docId === deleteTarget) setSelected(null);
    setDeleteTarget(null);
    await loadMessages(viewingUser);
  };

  /* ── compose send ── */
  const handleComposeSend = async () => {
    if (!composeRecipient) { setComposeError('Please choose a recipient.'); return; }
    if (!composeBody.trim()) { setComposeError('Please write a message.'); return; }
    setComposeSending(true);
    setComposeError('');
    try {
      const msg: Message = {
        senderUID: adminProfile.UID,
        senderProfileId: '',
        senderDisplayName: adminProfile.contact.displayName || 'Admin',
        recipientUID: composeRecipient,
        recipientProfileId: '',
        message: composeBody.trim(),
        mentorReply: MentorReply.not_applicable.toString(),
        technicalInterest: '',
        professionalInterest: '',
        sentByUID: adminProfile.UID,
        sentOn: Timestamp.now(),
      };
      await messagingService.sendMessage(msg);
      setComposeSent(true);
      setComposeRecipient('');
      setComposeBody('');
      if (viewingUser && viewingUser.UID === composeRecipient) {
        await loadMessages(viewingUser);
      }
    } catch {
      setComposeError('Failed to send. Please try again.');
    } finally {
      setComposeSending(false);
    }
  };

  /* ── email send ── */
  const handleEmailSend = async () => {
    if (!isValidEmail(emailTo)) { setEmailError('Please enter a valid email address.'); return; }
    if (!emailSubject.trim())   { setEmailError('Please enter a subject.'); return; }
    setEmailSending(true);
    setEmailError('');
    try {
      await sendEmail({ to: emailTo, subject: emailSubject, text: emailBody });
      setEmailSent(true);
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
    } catch {
      setEmailError('Failed to send email. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  /* ══════════ SIDEBAR ══════════ */
  const navItems: { key: AdminSection; label: string; icon: React.ReactNode }[] = [
    { key: 'inbox',   label: 'Inbox',      icon: <InboxIcon fontSize="small" /> },
    { key: 'sent',    label: 'Sent',       icon: <SendIcon fontSize="small" /> },
    { key: 'compose', label: 'Compose',    icon: <EditIcon fontSize="small" /> },
    { key: 'email',   label: 'Send Email', icon: <EmailIcon fontSize="small" /> },
  ];

  const Sidebar = (
    <Box sx={{
      width: isMobile ? '100%' : 220,
      flexShrink: 0,
      bgcolor: SIDEBAR_BG,
      color: SIDEBAR_TEXT,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: isMobile ? '12px 12px 0 0' : '12px 0 0 12px',
    }}>
      <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>Messages</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', letterSpacing: 0.3 }}>Admin Portal</Typography>
      </Box>

      <List dense sx={{ mt: 0.5 }}>
        {navItems.map(({ key, label, icon }) => (
          <ListItemButton
            key={key}
            selected={section === key}
            onClick={() => {
              setSection(key);
              setSelected(null);
              setShowDetail(false);
              if (key === 'compose') { setComposeSent(false); setComposeError(''); }
              if (key === 'email')   { setEmailSent(false);   setEmailError(''); }
            }}
            sx={{
              mx: 1, mb: 0.5, borderRadius: '8px', color: SIDEBAR_TEXT,
              '&.Mui-selected': { bgcolor: OSU_ORANGE, color: '#fff', '&:hover': { bgcolor: OSU_ORANGE } },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <ListItemAvatar sx={{ minWidth: 36 }}>{icon}</ListItemAvatar>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontWeight: section === key ? 700 : 400, fontSize: '0.875rem' }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* User selector pinned to bottom of sidebar */}
      <Box sx={{ mt: 'auto', px: 2, py: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
          View user
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            displayEmpty
            value={viewingUser?.UID ?? ''}
            onChange={handleUserSelect}
            renderValue={(v) => v
              ? <Typography variant="body2" noWrap sx={{ color: '#fff' }}>
                  {allUsers.find((u) => u.UID === v)?.contact.displayName ?? 'Unknown'}
                </Typography>
              : <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>Select user…</Typography>
            }
            sx={{
              bgcolor: 'rgba(255,255,255,0.07)',
              borderRadius: '8px',
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
              '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
            }}
          >
            {allUsers.map((u) => (
              <MenuItem key={u.UID} value={u.UID}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={avatarCache[u.UID]} sx={{ width: 24, height: 24, fontSize: '0.65rem', bgcolor: '#757575' }}>
                    {initials(u.contact.displayName)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                      {u.contact.displayName || `${u.personal.firstName} ${u.personal.lastName}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{u.preferences.role}</Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  /* ══════════ LIST PANEL ══════════ */
  const ListPanel = (
    <Box sx={{
      width: isMobile ? '100%' : 320,
      flexShrink: 0,
      bgcolor: PANEL_BG,
      borderRight: `1px solid ${BORDER_COLOR}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Box sx={{ p: 1.5, borderBottom: `1px solid ${BORDER_COLOR}` }}>
        <TextField
          size="small" fullWidth placeholder="Search messages…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
      </Box>

      <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${BORDER_COLOR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {section === 'inbox' ? 'Inbox' : 'Sent'} · {filtered.length}
        </Typography>
        {viewingUser && (
          <Chip
            icon={<PersonIcon sx={{ fontSize: '0.75rem !important' }} />}
            label={viewingUser.contact.displayName}
            size="small"
            sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#fff3ee', color: OSU_ORANGE, border: `1px solid ${OSU_ORANGE}` }}
          />
        )}
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
          <CircularProgress size={28} sx={{ color: OSU_ORANGE }} />
        </Box>
      )}

      {!loading && !viewingUser && (
        <Box sx={{ textAlign: 'center', pt: 6, px: 3 }}>
          <PersonIcon sx={{ fontSize: 48, opacity: 0.15, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Select a user in the sidebar to view their messages.
          </Typography>
        </Box>
      )}

      {!loading && viewingUser && filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', pt: 6, px: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {search ? 'No results.' : section === 'inbox' ? 'Inbox is empty.' : 'No sent messages.'}
          </Typography>
        </Box>
      )}

      <List disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
        {filtered.map((msg) => {
          const isSelected = selected?.docId === msg.docId;
          const isUnread   = section === 'inbox' && parseInt(msg.data.mentorReply, 10) === MentorReply.awaiting;
          const recipientName = allUsers.find((u) => u.UID === msg.data.recipientUID)?.contact.displayName ?? msg.data.recipientUID;

          return (
            <React.Fragment key={msg.docId}>
              <ListItemButton
                alignItems="flex-start"
                selected={isSelected}
                onClick={() => { setSelected(msg); if (isMobile) setShowDetail(true); }}
                sx={{
                  px: 2, py: 1.5,
                  bgcolor: isSelected ? SELECTED_BG : isUnread ? UNREAD_ACCENT : 'transparent',
                  borderLeft: isSelected ? `3px solid ${OSU_ORANGE}` : '3px solid transparent',
                  '&:hover': { bgcolor: isSelected ? SELECTED_BG : '#efefef' },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={avatarCache[msg.data.senderUID]}
                    sx={{ bgcolor: isSelected ? OSU_ORANGE : '#757575', width: 38, height: 38, fontSize: '0.85rem' }}
                  >
                    {initials(msg.data.senderDisplayName)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: isUnread ? 700 : 400, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {section === 'inbox' ? msg.data.senderDisplayName : `To: ${recipientName}`}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, flexShrink: 0 }}>
                        {formatDate(msg.data.sentOn)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary' }}>
                      {msg.data.message}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider component="li" />
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  /* ══════════ DETAIL PANE ══════════ */
  const DetailPane = (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff', overflow: 'hidden' }}>
      {!selected ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
          <InboxIcon sx={{ fontSize: 56, mb: 2, opacity: 0.25 }} />
          <Typography variant="body1">Select a message to read it</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* toolbar */}
          <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${BORDER_COLOR}`, display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton size="small" onClick={() => setShowDetail(false)}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                {section === 'inbox'
                  ? `From: ${selected.data.senderDisplayName}`
                  : `To: ${allUsers.find((u) => u.UID === selected.data.recipientUID)?.contact.displayName ?? selected.data.recipientUID}`
                }
              </Typography>
              <Typography variant="caption" color="text.secondary">{fullDate(selected.data.sentOn)}</Typography>
            </Box>
            <Tooltip title="Delete message">
              <IconButton size="small" onClick={() => setDeleteTarget(selected.docId)} sx={{ '&:hover': { color: 'error.main' } }}>
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* meta row */}
          <Box sx={{ px: 3, py: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', borderBottom: `1px solid ${BORDER_COLOR}` }}>
            <Chip
              avatar={
                <Avatar src={avatarCache[selected.data.senderUID]} sx={{ width: 20, height: 20, fontSize: '0.65rem', bgcolor: '#888' }}>
                  {initials(selected.data.senderDisplayName)}
                </Avatar>
              }
              label={`From: ${selected.data.senderDisplayName}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`To: ${allUsers.find((u) => u.UID === selected.data.recipientUID)?.contact.displayName ?? selected.data.recipientUID}`}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* body */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
            <Paper elevation={0} sx={{ bgcolor: '#f7f7f7', borderRadius: '10px', p: 3 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {selected.data.message}
              </Typography>
            </Paper>
          </Box>
        </Box>
      )}
    </Box>
  );

  /* ══════════ COMPOSE PANE ══════════ */
  const ComposePane = (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff', overflow: 'hidden' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${BORDER_COLOR}` }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>New Internal Message</Typography>
        <Typography variant="caption" color="text.secondary">
          Send a platform message as Admin — appears in the recipient's inbox.
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {composeSent ? (
          <Alert severity="success" onClose={() => setComposeSent(false)}>
            Message sent successfully!
          </Alert>
        ) : (
          <>
            <FormControl fullWidth>
              <InputLabel id="compose-to-label">To</InputLabel>
              <Select
                labelId="compose-to-label"
                label="To"
                value={composeRecipient}
                onChange={(e: SelectChangeEvent<string>) => setComposeRecipient(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                {allUsers.map((u) => (
                  <MenuItem key={u.UID} value={u.UID}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={avatarCache[u.UID]} sx={{ width: 24, height: 24, fontSize: '0.65rem', bgcolor: '#757575' }}>
                        {initials(u.contact.displayName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{u.contact.displayName}</Typography>
                        <Typography variant="caption" color="text.secondary">{u.preferences.role}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Message"
              multiline
              minRows={14}
              fullWidth
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                '& .MuiInputBase-input': { resize: 'vertical', overflow: 'auto' },
              }}
            />

            {composeError && <Alert severity="error">{composeError}</Alert>}
          </>
        )}
      </Box>

      {!composeSent && (
        <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${BORDER_COLOR}`, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            disabled={composeSending}
            onClick={handleComposeSend}
            startIcon={composeSending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            sx={{ bgcolor: OSU_ORANGE, color: '#fff', borderRadius: '8px', border: 'none', '&:hover': { bgcolor: '#b83804', color: '#fff', border: 'none' } }}
          >
            {composeSending ? 'Sending…' : 'Send Message'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => { setComposeRecipient(''); setComposeBody(''); setComposeError(''); }}
            sx={{ borderRadius: '8px' }}
          >
            Clear
          </Button>
        </Box>
      )}
    </Box>
  );

  /* ══════════ EMAIL PANE ══════════ */
  const EmailPane = (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff', overflow: 'hidden' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${BORDER_COLOR}` }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Send Email</Typography>
        <Typography variant="caption" color="text.secondary">
          Outbound email via Firebase Trigger Email extension.
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {emailSent ? (
          <Alert severity="success" onClose={() => setEmailSent(false)}>
            Email sent successfully!
          </Alert>
        ) : (
          <>
            <TextField
              label="To"
              type="email"
              fullWidth
              required
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="recipient@example.com"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <TextField
              label="Subject"
              fullWidth
              required
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <TextField
              label="Message"
              multiline
              minRows={12}
              fullWidth
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                '& .MuiInputBase-input': { resize: 'vertical', overflow: 'auto' },
              }}
            />

            {emailError && <Alert severity="error">{emailError}</Alert>}
          </>
        )}
      </Box>

      {!emailSent && (
        <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${BORDER_COLOR}`, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            disabled={emailSending}
            onClick={handleEmailSend}
            startIcon={emailSending ? <CircularProgress size={16} color="inherit" /> : <EmailIcon />}
            sx={{ bgcolor: OSU_ORANGE, color: '#fff', borderRadius: '8px', border: 'none', '&:hover': { bgcolor: '#b83804', color: '#fff', border: 'none' } }}
          >
            {emailSending ? 'Sending…' : 'Send Email'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => { setEmailTo(''); setEmailSubject(''); setEmailBody(''); setEmailError(''); }}
            sx={{ borderRadius: '8px' }}
          >
            Clear
          </Button>
        </Box>
      )}
    </Box>
  );

  /* ══════════ RENDER ══════════ */
  const showListPanel   = section === 'inbox' || section === 'sent';
  const showComposePane = section === 'compose';
  const showEmailPane   = section === 'email';

  return (
    <Box sx={{ mt: '35px', pb: 6, width: '100%', boxSizing: 'border-box' }}>
      {globalError && <Alert severity="error" sx={{ mb: 2 }}>{globalError}</Alert>}

      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          height: isMobile ? 'auto' : 680,
          minHeight: 540,
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${BORDER_COLOR}`,
        }}
      >
        {(!isMobile || !showDetail) && Sidebar}
        {showListPanel && (!isMobile || !showDetail) && ListPanel}
        {showListPanel && (!isMobile || showDetail) && DetailPane}
        {showComposePane && ComposePane}
        {showEmailPane   && EmailPane}
      </Paper>

      {/* Delete dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          <DialogContentText>Permanently delete this message? This cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminMessages;
