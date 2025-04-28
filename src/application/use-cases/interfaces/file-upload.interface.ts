export interface FileUploadInterface {
  uploadFile(file: Express.Multer.File): Promise<string>;
}
