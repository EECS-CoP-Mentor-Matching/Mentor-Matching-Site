import interestsDb from "../../dal/interestsDb";
import { TechnicalInterest } from "../../types/matchProfile";
import { DocItem, DropDownOption } from "../../types/types";
import DropDownControlLoaderRedux from "../common/forms/dropDowns/DropDownControlLoaderRedux";

interface SelectTechnicalInterestProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectTechnicalInterest({ onSelectDispatch, currentValue }: SelectTechnicalInterestProps) {
  const mapOptions = ((interests: DocItem<TechnicalInterest>[]): DropDownOption[] => {
    const combinedInterests = interests.flatMap(interest =>
      [interest.data.broadInterest, ...interest.data.specificInterests]
    );

    const options = new Array<DropDownOption>;
    let i = 0;
    combinedInterests.forEach(currInterest => {
      options.push({
        label: currInterest,
        id: `${currInterest}${i++}`
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux label="Interests"
      onSelectDispatch={onSelectDispatch}
      dbSearchAsync={interestsDb.searchTechnicalInterests}
      mappingMethod={mapOptions}
      selectedOption={currentValue}
    />
  );
}

export default SelectTechnicalInterest;