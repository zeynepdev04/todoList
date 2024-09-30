import { api as index } from "..";

const api = index.injectEndpoints({
	endpoints: (build) => ({
		uploadFile: build.mutation<UPLOAD.UploadFileRes, UPLOAD.UploadFileReq>({
			query: (data) => ({
				url: `/upload/file`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["upload"],
		}),
	}),
});

export const { useUploadFileMutation } = api;
