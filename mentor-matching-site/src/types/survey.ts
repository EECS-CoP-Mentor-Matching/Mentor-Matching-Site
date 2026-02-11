export interface SurveySchema {
  title: string
  version: number
  isCurrentSchema: boolean
}

export interface SurveyQuestion {
    algorithmWeight: 0 | 1 | 2 | 3 | 4 | 5
    displayUi: DisplayUi
    optionFreeResponse: boolean
    optionOptIn: boolean
    prompts: PromptsDict
    required: boolean
    status: boolean
}

type PromptsDict = {
    "mentee": string
    "mentor": string
}

enum DisplayUi {
    checkbox = "checkbox",
    radio = "radio",
    dropdown = "dropdown"
}

export interface SurveyOption {
    QID: string
    label: string
    status: boolean
}