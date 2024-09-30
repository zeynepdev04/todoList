namespace UPLOAD {
	type UploadFileRes = {
		name: string;
		format: string;
		url: string;
	};
	type UploadFileReq = FormData;
}
