/**
 * Messages.tsx — Email-style messaging portal
 *
 * Replaces the old flat list with:
 *  • Sidebar: Inbox / Sent tabs + Compose button
 *  • Message list pane (avatar, sender, preview, date, status chip)
 *  • Detail pane (full message + accept/decline for mentors)
 *  • Compose modal (recipient dropdown, message body)
 *
 * Backward-compatibility notes:
 *  - Props signature unchanged: userProfile: UserProfile, adminView: Boolean
 *  - Data layer unchanged: messagingService, same Firestore "messages" collection
 *  - MentorReply enum values unchanged; no new Firestore fields written
 *  - ViewMessage.tsx, MessageCard.tsx, MessageHistoryCard.tsx are NOT touched
 *    (still used by MatchRequests / MentorMatchHistory in mentorPortal)
 *  - /send-message route preserved in App.tsx (SendMessageForm.tsx untouched)
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import { Timestamp } from 'firebase/firestore';

import { messagingService } from '../../../service/messagingService';
import userService from '../../../service/userService';
import { DocItem } from '../../../types/types';
import { MentorReply, Message } from '../../../types/matchProfile';
import { UserProfile } from '../../../types/userProfile';

/* ── Brand colours ── */
const OSU_ORANGE = '#DC4405';
const SIDEBAR_BG = '#1a1a1a';
const SIDEBAR_TEXT = '#f5f5f5';
const PANEL_BG = '#fafafa';
const BORDER_COLOR = '#e0e0e0';
const UNREAD_ACCENT = '#fff8f5';
const SELECTED_BG = '#fff3ee';

type Folder = 'inbox' | 'sent';

/* ─── helpers ─── */
function formatDate(raw: any): string {
  if (!raw) return '';
  try {
    const d: Date = typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw);
    const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
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

function statusChip(msg: DocItem<Message>, folder: Folder): { label: string; color: 'default' | 'warning' | 'success' | 'error' } | null {
  const r = parseInt(msg.data.mentorReply, 10);
  if (r === MentorReply.accepted) return { label: 'Accepted', color: 'success' };
  if (r === MentorReply.denied)   return { label: 'Declined', color: 'error' };
  if (r === MentorReply.awaiting) return { label: folder === 'sent' ? 'Pending' : 'Awaiting', color: 'warning' };
  return null;
}

function initials(name: string): string {
  return (name || '?').split(' ').map((w) => w[0] ?? '').slice(0, 2).join('').toUpperCase();
}

/* ══════════════════════════════════════════════
   Main component
══════════════════════════════════════════════ */
interface MessagesProps {
  userProfile: UserProfile;
  adminView: Boolean;
}

function Messages({ userProfile, adminView }: MessagesProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [folder, setFolder]         = useState<Folder>('inbox');
  const [inbound, setInbound]       = useState<DocItem<Message>[]>([]);
  const [sent, setSent]             = useState<DocItem<Message>[]>([]);
  const [selected, setSelected]     = useState<DocItem<Message> | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [replying, setReplying]     = useState(false);
  const [avatarCache, setAvatarCache] = useState<Record<string, string>>({});

  /* compose */
  const [composeOpen, setComposeOpen]       = useState(false);
  const [allUsers, setAllUsers]             = useState<UserProfile[]>([]);
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeBody, setComposeBody]       = useState('');
  const [composeSending, setComposeSending] = useState(false);
  const [composeError, setComposeError]     = useState('');
  const [composeSent, setComposeSent]       = useState(false);

  /* ── load messages ── */
  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [inboundMsgs, sentMsgs] = await Promise.all([
        messagingService.getMessagesSentToUser(userProfile.UID),
        messagingService.getMessagesSentByUser(userProfile.UID),
      ]);
      setInbound(inboundMsgs);
      setSent(sentMsgs);

      // Build avatar cache: fetch profile image for each unique sender, silently ignore failures
      const allMsgs = [...inboundMsgs, ...sentMsgs];
      const uniqueSenderUIDs = [...new Set(allMsgs.map((m) => m.data.senderUID).filter(Boolean))];
      const cache: Record<string, string> = {};
      await Promise.all(
        uniqueSenderUIDs.map(async (uid) => {
          try {
            const profile = await userService.getUserProfile(uid);
            if (profile?.imageUrl) cache[uid] = profile.imageUrl;
          } catch { /* no avatar available, initials fallback will show */ }
        })
      );
      setAvatarCache(cache);
    } catch {
      setError('Could not load messages. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  }, [userProfile.UID]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  useEffect(() => {
    if (!adminView) {
      userService.getAllUserProfiles().then(setAllUsers).catch(() => {});
    }
  }, [adminView]);

  /* ── filtered list ── */
  const activeList = folder === 'inbox' ? inbound : sent;
  const filtered = activeList.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.data.senderDisplayName?.toLowerCase().includes(q) || m.data.message?.toLowerCase().includes(q);
  });

  const unreadCount = inbound.filter((m) => parseInt(m.data.mentorReply, 10) === MentorReply.awaiting).length;

  /* ── handlers ── */
  const selectMessage = (msg: DocItem<Message>) => {
    setSelected(msg);
    if (isMobile) setShowDetail(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await messagingService.deleteMessage(deleteTarget);
    if (selected?.docId === deleteTarget) setSelected(null);
    setDeleteTarget(null);
    await loadMessages();
  };

  const handleMentorReply = async (reply: MentorReply) => {
    if (!selected) return;
    setReplying(true);
    try {
      await messagingService.mentorReply(selected.docId, selected.data, reply);
      setSelected((prev) => prev ? { ...prev, data: { ...prev.data, mentorReply: reply.toString() } } : prev);
      await loadMessages();
    } catch {
      setError('Failed to update reply. Please try again.');
    } finally {
      setReplying(false);
    }
  };

  const handleComposeSend = async () => {
    if (!composeRecipient) { setComposeError('Please choose a recipient.'); return; }
    if (!composeBody.trim()) { setComposeError('Please write a message.'); return; }
    setComposeSending(true);
    setComposeError('');
    try {
      const msg: Message = {
        senderUID: userProfile.UID,
        senderProfileId: '',
        senderDisplayName: userProfile.contact.displayName,
        recipientUID: composeRecipient,
        recipientProfileId: '',
        message: composeBody.trim(),
        mentorReply: MentorReply.not_applicable.toString(),
        technicalInterest: '',
        professionalInterest: '',
        sentByUID: userProfile.UID,
        sentOn: Timestamp.now(),
      };
      await messagingService.sendMessage(msg);
      setComposeSent(true);
      setComposeRecipient('');
      setComposeBody('');
      await loadMessages();
    } catch {
      setComposeError('Failed to send. Please try again.');
    } finally {
      setComposeSending(false);
    }
  };

  const closeCompose = () => {
    setComposeOpen(false);
    setComposeSent(false);
    setComposeError('');
    setComposeRecipient('');
    setComposeBody('');
  };

  const isAwaitingReply      = selected && parseInt(selected.data.mentorReply, 10) === MentorReply.awaiting;
  const showMentorActions    = !adminView && folder === 'inbox' && isAwaitingReply && selected?.data.recipientUID === userProfile.UID;

  /* ══════════ SIDEBAR ══════════ */
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
      </Box>

      {!adminView && (
        <Box sx={{ px: 2, py: 1.5 }}>
          <Button
            fullWidth
            startIcon={<EditIcon />}
            onClick={() => setComposeOpen(true)}
            sx={{
              bgcolor: OSU_ORANGE, color: '#fff', fontWeight: 600, borderRadius: '8px',
              border: 'none',
              '&:hover': { bgcolor: '#b83804', color: '#fff', border: 'none' },
            }}
          >
            Compose
          </Button>
        </Box>
      )}

      <List dense sx={{ mt: 0.5 }}>
        {[
          { key: 'inbox', label: 'Inbox', icon: <InboxIcon fontSize="small" />, badge: unreadCount },
          { key: 'sent',  label: 'Sent',  icon: <SendIcon fontSize="small" />,  badge: 0 },
        ].map(({ key, label, icon, badge }) => (
          <ListItemButton
            key={key}
            selected={folder === key}
            onClick={() => { setFolder(key as Folder); setSelected(null); setShowDetail(false); }}
            sx={{
              mx: 1, mb: 0.5, borderRadius: '8px', color: SIDEBAR_TEXT,
              '&.Mui-selected': { bgcolor: OSU_ORANGE, color: '#fff', '&:hover': { bgcolor: OSU_ORANGE } },
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <ListItemAvatar sx={{ minWidth: 36 }}>{icon}</ListItemAvatar>
            <ListItemText primary={label} primaryTypographyProps={{ fontWeight: folder === key ? 700 : 400 }} />
            {badge > 0 && (
              <Chip label={badge} size="small" sx={{ bgcolor: '#fff', color: OSU_ORANGE, fontWeight: 700, height: 20, fontSize: '0.68rem' }} />
            )}
          </ListItemButton>
        ))}
      </List>
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
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
      </Box>

      <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${BORDER_COLOR}` }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {folder === 'inbox' ? 'Inbox' : 'Sent'} · {filtered.length}
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
          <CircularProgress size={28} sx={{ color: OSU_ORANGE }} />
        </Box>
      )}

      {!loading && filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', pt: 6, px: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {search ? 'No results.' : folder === 'inbox' ? 'Your inbox is empty.' : 'No sent messages yet.'}
          </Typography>
        </Box>
      )}

      <List disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
        {filtered.map((msg) => {
          const isSelected = selected?.docId === msg.docId;
          const isUnread = folder === 'inbox' && parseInt(msg.data.mentorReply, 10) === MentorReply.awaiting;
          const chip = statusChip(msg, folder);

          return (
            <React.Fragment key={msg.docId}>
              <ListItemButton
                alignItems="flex-start"
                selected={isSelected}
                onClick={() => selectMessage(msg)}
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
                        {folder === 'inbox' ? msg.data.senderDisplayName : 'Sent'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', ml: 1, flexShrink: 0 }}>
                        {formatDate(msg.data.sentOn)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary' }}>
                        {msg.data.message}
                      </Typography>
                      {chip && <Chip label={chip.label} color={chip.color} size="small" sx={{ mt: 0.5, height: 18, fontSize: '0.65rem' }} />}
                    </Box>
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
  const chip = selected ? statusChip(selected, folder) : null;
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
                {folder === 'inbox' ? `From: ${selected.data.senderDisplayName}` : 'Sent Message'}
              </Typography>
              <Typography variant="caption" color="text.secondary">{fullDate(selected.data.sentOn)}</Typography>
            </Box>
            {!adminView && folder === 'inbox' && (
              <>
                <Tooltip title="Reply">
                  <IconButton size="small" onClick={() => {
                    setComposeRecipient(selected.data.senderUID);
                    const date = fullDate(selected.data.sentOn);
                    setComposeBody(`\n\n— On ${date}, ${selected.data.senderDisplayName} wrote:\n> ${selected.data.message.split('\n').join('\n> ')}`);
                    setComposeOpen(true);
                  }} sx={{ '&:hover': { color: OSU_ORANGE } }}>
                    <ReplyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => setDeleteTarget(selected.docId)} sx={{ '&:hover': { color: 'error.main' } }}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>

          {/* meta */}
          <Box sx={{ px: 3, py: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', borderBottom: `1px solid ${BORDER_COLOR}` }}>
            <Chip
              avatar={<Avatar src={avatarCache[selected.data.senderUID]} sx={{ width: 20, height: 20, fontSize: '0.65rem', bgcolor: '#888' }}>{initials(selected.data.senderDisplayName)}</Avatar>}
              label={`From: ${selected.data.senderDisplayName}`}
              size="small" variant="outlined"
            />
            {chip && <Chip label={chip.label} color={chip.color} size="small" />}
            {selected.data.technicalInterest   && <Chip label={selected.data.technicalInterest}   size="small" color="secondary" variant="outlined" />}
            {selected.data.professionalInterest && <Chip label={selected.data.professionalInterest} size="small" color="secondary" variant="outlined" />}
          </Box>

          {/* body */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>
            <Paper elevation={0} sx={{ bgcolor: '#f7f7f7', borderRadius: '10px', p: 3 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {selected.data.message}
              </Typography>
            </Paper>

            {parseInt(selected.data.mentorReply, 10) === MentorReply.accepted && folder === 'inbox' && (
              <Alert severity="success" sx={{ mt: 3 }}>
                This request was accepted! The mentor should reach out to you directly.
              </Alert>
            )}
            {parseInt(selected.data.mentorReply, 10) === MentorReply.denied && (
              <Alert severity="info" sx={{ mt: 3 }}>
                This request was declined.
              </Alert>
            )}
          </Box>

          {/* accept / decline (mentors only, inbox only, awaiting only) */}
          {showMentorActions && (
            <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${BORDER_COLOR}`, display: 'flex', gap: 2, alignItems: 'center', bgcolor: '#fefefe' }}>
              <Button
                variant="contained"
                startIcon={<CheckCircleOutlineIcon />}
                disabled={replying}
                onClick={() => handleMentorReply(MentorReply.accepted)}
                sx={{ bgcolor: '#2e7d32', color: '#fff', borderRadius: '8px', border: 'none', '&:hover': { bgcolor: '#1b5e20', color: '#fff', border: 'none' } }}
              >
                Accept Request
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelOutlinedIcon />}
                disabled={replying}
                onClick={() => handleMentorReply(MentorReply.denied)}
                sx={{ borderColor: '#c62828', color: '#c62828', borderRadius: '8px', '&:hover': { bgcolor: '#ffebee', color: '#c62828', borderColor: '#c62828' } }}
              >
                Decline
              </Button>
              {replying && <CircularProgress size={20} sx={{ color: OSU_ORANGE }} />}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  /* ══════════ RENDER ══════════ */
  return (
    <Box sx={{ mt: '35px', pb: 6, width: '100%', boxSizing: 'border-box' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          height: isMobile ? 'auto' : 620,
          minHeight: 520,
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${BORDER_COLOR}`,
        }}
      >
        {!isMobile && Sidebar}
        {isMobile && !showDetail && Sidebar}
        {(!isMobile || !showDetail) && ListPanel}
        {(!isMobile || showDetail) && DetailPane}
      </Paper>

      {/* ── Delete dialog ── */}
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

      {/* ── Compose dialog ── */}
      <Dialog open={composeOpen} onClose={closeCompose} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700 }}>New Message</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          {composeSent ? (
            <Alert severity="success">Message sent successfully!</Alert>
          ) : (
            <>
              <FormControl fullWidth size="small">
                <InputLabel id="compose-to-label">To</InputLabel>
                <Select
                  labelId="compose-to-label"
                  label="To"
                  value={composeRecipient}
                  onChange={(e: SelectChangeEvent<string>) => setComposeRecipient(e.target.value)}
                >
                  {allUsers
                    .filter((u) => u.UID !== userProfile.UID)
                    .map((u) => (
                      <MenuItem key={u.UID} value={u.UID}>{u.contact.displayName}</MenuItem>
                    ))}
                </Select>
              </FormControl>

              <TextField
                label="Message" multiline minRows={10} fullWidth size="small"
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                sx={{ maxWidth: '100%', width: '100%', '& .MuiInputBase-root': { width: '100%' }, '& .MuiInputBase-input': { resize: 'vertical', overflow: 'auto', minHeight: '160px' } }}
              />
              {composeError && <Alert severity="error">{composeError}</Alert>}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeCompose} variant="outlined" sx={{ borderRadius: '8px' }}>
            {composeSent ? 'Close' : 'Cancel'}
          </Button>
          {!composeSent && (
            <Button
              onClick={handleComposeSend}
              variant="contained"
              disabled={composeSending}
              startIcon={composeSending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              sx={{ bgcolor: OSU_ORANGE, color: '#fff', borderRadius: '8px', border: 'none', '&:hover': { bgcolor: '#b83804', color: '#fff', border: 'none' } }}
            >
              Send
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Messages;
