export interface PipelineStepToStore {
    task:string,
    api:string,
    inputFileId : string,
    outputFileIds: string[],
    dataset:string,
    performance:string,
    system:string,
    inputFilename: string,
    outputFilenames :string[],
}
