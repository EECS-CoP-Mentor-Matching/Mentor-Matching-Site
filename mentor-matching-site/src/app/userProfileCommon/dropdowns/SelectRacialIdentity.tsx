import DropDownControlRedux from "../../common/forms/dropDowns/DropDownControlRedux";
import { useState, useEffect } from "react";
import { DropDownOption } from "../../../types/types";
import { RacialIdentity } from "../../../types/userProfile";
import selectionItemsDb from "../../../dal/selectionItemsDb";

interface SelectRacialIdentityProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue: any
}

function SelectRacialIdentity({ onSelectDispatch, currentValue }: SelectRacialIdentityProps) {
  const [racialIdentities, setRacialIdentities] = useState<DropDownOption[]>(new Array<DropDownOption>);

  useEffect(() => {
    if (racialIdentities.length === 0) {
      const fetchOptions = (async () => {
        const identities = await selectionItemsDb.racialIdentitiesAsync();
        const options = loadOptions(identities);
        setRacialIdentities(options);
      });
      fetchOptions();
    }
  }, [racialIdentities, setRacialIdentities]);

  const loadOptions = ((identities: RacialIdentity[]): DropDownOption[] => {
    const loadOptions = new Array<DropDownOption>;

    identities.forEach(currIdentity => {
      loadOptions.push({
        label: currIdentity.identityName,
        id: currIdentity.id
      });
    });
    return loadOptions;
  });

  return (
    <DropDownControlRedux label="Racial Identity"
      options={racialIdentities}
      onSelectDispatch={onSelectDispatch}
      selectedOption={currentValue}
    />
  );
}

export default SelectRacialIdentity;