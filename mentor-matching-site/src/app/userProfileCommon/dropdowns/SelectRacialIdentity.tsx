import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";
import { useState, useEffect } from "react";
import { DocItem, DropDownOption } from "../../../types/types";
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

  const mapOptions = ((identities: DocItem<RacialIdentity>[]): DropDownOption[] => {
    const loadOptions = new Array<DropDownOption>();
    identities.forEach(currIdentity => {
      loadOptions.push({
        label: currIdentity.data.identityName,
        id: currIdentity.docId
      });
    });
    return loadOptions;
  });

  return (
    <DropDownControlLoaderRedux label="Racial Identity"
      mappingMethod={mapOptions}
      onSelectDispatch={onSelectDispatch}
      selectedValue={currentValue}
      dbSearchAsync={selectionItemsDb.racialIdentitiesAsync}
      valueIs="label"
    />
  );
}

export default SelectRacialIdentity;