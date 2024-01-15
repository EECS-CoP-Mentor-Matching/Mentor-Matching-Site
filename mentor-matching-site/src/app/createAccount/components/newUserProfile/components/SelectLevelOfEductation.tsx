import selectionItemsDb from "../../../../../dal/selectionItemsDb";
import { EducationLevel, DropDownOption } from "../../../../../types";
import DropDownControl from "../../../../common/forms/DropDownControl";
import { useEffect, useState } from "react";

interface SelectLevelOfEducationProps {
  onSelect: (value: string | undefined) => void
}

function SelectLevelOfEducation(props: SelectLevelOfEducationProps) {
  const [educationLevels, setEducationLevels] = useState<DropDownOption[]>(new Array<DropDownOption>);

  useEffect(() => {
    const fetchOptions = (async () => {
      const levels = await selectionItemsDb.educationLevelsAsync();
      const options = loadOptions(levels);
      setEducationLevels(options);
    });

    fetchOptions();
  });

  const loadOptions = ((levels: EducationLevel[]): DropDownOption[] => {
    const loadOptions = new Array<DropDownOption>;

    levels.forEach(currLevel => {
      loadOptions.push({
        label: currLevel.educationLevel,
        id: currLevel.levelHeirarchy
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