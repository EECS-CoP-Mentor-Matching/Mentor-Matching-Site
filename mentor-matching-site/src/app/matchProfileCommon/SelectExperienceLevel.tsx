import "./ExperienceLevel.css";
import { EducationLevel, ExperienceLevel } from "../../types/matchProfile";
import { DocItem, DropDownOption } from "../../types/types";
import selectionItemsDb from "../../dal/selectionItemsDb";
import DropDownControlLoaderRedux from "../common/forms/dropDowns/DropDownControlLoaderRedux";
import interestsDb from "../../dal/interestsDb";

interface SelectExperienceLevelProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectExperienceLevel({ onSelectDispatch, currentValue }: SelectExperienceLevelProps) {
  const mapOptions = ((interests: DocItem<ExperienceLevel>[]): DropDownOption[] => {
    const options = new Array<DropDownOption>;
    interests.sort((a, b) => a.data.hierarchy - b.data.hierarchy).forEach(currInterest => {
      options.push({
        label: currInterest.data.level,
        id: currInterest.data.hierarchy
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux label="Experience Level"
      onSelectDispatch={onSelectDispatch}
      dbSearchAsync={interestsDb.searchExperienceLevels}
      mappingMethod={mapOptions}
      selectedValue={currentValue}
    />
  );
}

export default SelectExperienceLevel;