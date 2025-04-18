export class UploadProfilePhotoCommand {
  constructor(public readonly userId: string, public readonly photoPath: string) {}
}
