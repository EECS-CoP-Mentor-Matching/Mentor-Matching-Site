import interestsDb from "../../dal/interestsDb";
import { ProfessionalInterest } from "../../types/matchProfile";
import { DropDownOption } from "../../types/types";
import DropDownControlLoaderRedux from "../common/forms/dropDowns/DropDownControlLoaderRedux";

interface SelectProfessionalInterestProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectProfessionalInterest({ onSelectDispatch, currentValue }: SelectProfessionalInterestProps) {
  const mapOptions = ((interests: ProfessionalInterest[]): DropDownOption[] => {
    const options = new Array<DropDownOption>;
    let i = 0;
    interests.forEach(currInterest => {
      const interest = currInterest.professionalInterest
      options.push({
        label: interest,
        id: `${interest}${i++}`
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux label="Interests"
      onSelectDispatch={onSelectDispatch}
      dbSearchAsync={interestsDb.searchProfessionalInterests}
      mappingMethod={mapOptions}
      selectedOption={currentValue}
    />
  );
}

export default SelectProfessionalInterest;