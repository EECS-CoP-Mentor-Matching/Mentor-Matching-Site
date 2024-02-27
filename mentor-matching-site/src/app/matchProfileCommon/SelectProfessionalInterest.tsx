import interestsDb from "../../dal/interestsDb";
import { ProfessionalInterest } from "../../types/matchProfile";
import { DocItem, DropDownOption } from "../../types/types";
import DropDownControlLoaderRedux from "../common/forms/dropDowns/DropDownControlLoaderRedux";

interface SelectProfessionalInterestProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectProfessionalInterest({ onSelectDispatch, currentValue }: SelectProfessionalInterestProps) {
  const mapOptions = ((interests: DocItem<ProfessionalInterest>[]): DropDownOption[] => {
    const options = new Array<DropDownOption>;
    interests.forEach(currInterest => {
      options.push({
        label: currInterest.data.professionalInterest,
        id: currInterest.docId
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux label="Interests"
      onSelectDispatch={onSelectDispatch}
      dbSearchAsync={interestsDb.searchProfessionalInterests}
      mappingMethod={mapOptions}
      selectedValue={currentValue}
      valueIs="label"
    />
  );
}

export default SelectProfessionalInterest;