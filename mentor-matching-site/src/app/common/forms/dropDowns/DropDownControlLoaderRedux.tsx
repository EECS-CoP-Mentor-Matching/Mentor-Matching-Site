import { DropDownOption } from "../../../../types/types"
import DropDownControlRedux from "./DropDownControlRedux"
import { useState, useEffect } from "react"

interface DropDownControlLoaderReduxProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  dbSearchAsync: () => Promise<any[]>
  mappingMethod: (values: any[]) => DropDownOption[]
  label?: string
  selectedValue?: any
  valueIs?: ('id' | 'label')
}

function DropDownControlLoaderRedux({ onSelectDispatch, dbSearchAsync, mappingMethod, label, selectedValue, valueIs = 'id' }: DropDownControlLoaderReduxProps) {
  const [dropDownOptions, setDropDownOptions] = useState<DropDownOption[] | null>(null);

  useEffect(() => {
    if (dropDownOptions === null) {
      const fetchOptions = (async () => {
        const levels = await dbSearchAsync();
        const options = mappingMethod(levels);
        setDropDownOptions(options);
      });
      fetchOptions();
    }
  }, [dropDownOptions, setDropDownOptions]);

  const dataIsLoading = () => {
    if (dropDownOptions === null) {
      return (<>Data is loading...</>)
    }
    else {
      return display;
    }
  }

  const display = (
    <DropDownControlRedux
      label={label}
      options={dropDownOptions as DropDownOption[]}
      onSelectDispatch={onSelectDispatch}
      selectedValue={selectedValue}
      valueIs={valueIs}
    />
  );

  return (
    <>{dataIsLoading()}</>
  );
}

export default DropDownControlLoaderRedux;