export type QuestionType = "multiple-choice" | "text";

export interface Question {
    id: string;
    type: QuestionType;
    question: string;
    options?: string[];
    answer: string;
}

export interface QuestionSet {
    id: string;
    title: string;
    questions: Question[];
}
