export interface SurveySchema {
  title: string
  version: number
}

export interface Question {
    algorithmWeight: 0 | 1 | 2 | 3 | 4 | 5
    displayUi: DisplayUi
    optionFreeResponse?: boolean
    optionOptIn?: boolean
    prompts: PromptsDict
    required: boolean
    status: boolean
    options?: Option[]
}

export type PromptsDict = {
    "mentee": string
    "mentor": string
}

export enum DisplayUi {
    checkbox = "checkbox",
    radio = "radio",
    dropdown = "dropdown"
}

export enum AlgorithmWeight {
    nonweighted,
    w1,
    w2,
    w3,
    w4,
    w5,
}

export interface Option {
    label: string
}