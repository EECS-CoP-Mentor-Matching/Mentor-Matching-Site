import selectionItemsDb from "../../../../../dal/selectionItemsDb";
import { EducationLevel } from "../../../../../types/matchProfile";
import { DropDownOption } from "../../../../../types/types";
import DropDownControl from "../../../../common/forms/DropDownControl";
import { useEffect, useState } from "react";

interface SelectLevelOfEducationProps {
  onSelect: (value: string | undefined) => void
}

function SelectLevelOfEducation(props: SelectLevelOfEducationProps) {
  const [educationLevels, setEducationLevels] = useState<DropDownOption[]>(new Array<DropDownOption>);

  useEffect(() => {
    if (educationLevels.length === 0) {
      const fetchOptions = (async () => {
        const levels = await selectionItemsDb.educationLevelsAsync();
        const options = loadOptions(levels);
        setEducationLevels(options);
      });
      fetchOptions();
    }
  }, [educationLevels, setEducationLevels]);

  const loadOptions = ((levels: EducationLevel[]): DropDownOption[] => {
    const loadOptions = new Array<DropDownOption>;

    levels.forEach(currLevel => {
      console.log("curr level", currLevel)
      loadOptions.push({
        label: currLevel.level,
        id: currLevel.hierarchy
      });
    });

    return loadOptions;
  })

  return (
    <DropDownControl inputLabel="Level of Education"
      options={educationLevels}
      onSelect={props.onSelect}
    />
  );
}

export default SelectLevelOfEducation;