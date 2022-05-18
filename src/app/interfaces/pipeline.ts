import { PipelineStepToStore } from "./pipeline-step-to-store";

export interface Pipeline {
    name: string;
    author: string;
    creationTime: string;
    notes: string;
    steps: PipelineStepToStore[],
}
