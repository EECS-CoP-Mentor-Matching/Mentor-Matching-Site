import "./ExperienceLevel.css";
import { EducationLevel } from "../../types/matchProfile";
import { DocItem, DropDownOption } from "../../types/types";
import selectionItemsDb from "../../dal/selectionItemsDb";
import DropDownControlLoaderRedux from "../common/forms/dropDowns/DropDownControlLoaderRedux";

interface ExperienceLevelProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function ExperienceLevel({ onSelectDispatch, currentValue }: ExperienceLevelProps) {
  const mapOptions = ((interests: DocItem<EducationLevel>[]): DropDownOption[] => {
    const options = new Array<DropDownOption>;
    interests.forEach(currInterest => {
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
      dbSearchAsync={selectionItemsDb.educationLevelsAsync}
      mappingMethod={mapOptions}
      selectedOption={currentValue}
    />
  );
}

export default ExperienceLevel;