import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";
import { useState, useEffect } from "react";
import { DropDownOption } from "../../../types/types";
import { RacialIdentity } from "../../../types/userProfile";
import selectionItemsDb from "../../../dal/selectionItemsDb";

interface SelectRacialIdentityProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: any
}

function SelectRacialIdentity({ onSelectDispatch, currentValue }: SelectRacialIdentityProps) {

  const mapOptions = ((identities: RacialIdentity[]): DropDownOption[] => {
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
    <DropDownControlLoaderRedux label="Racial Identity"
      mappingMethod={mapOptions}
      onSelectDispatch={onSelectDispatch}
      selectedOption={currentValue}
      dbSearchAsync={selectionItemsDb.racialIdentitiesAsync}
    />
  );
}

export default SelectRacialIdentity;