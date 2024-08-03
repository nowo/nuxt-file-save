
///////////////////////////////////////////////////////////
// Functionality based on Nuxt Hub's Blob implementation //
///////////////////////////////////////////////////////////

// Credits from shared utils of https://github.com/pingdotgg/uploadthing
declare type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';
declare type BlobSize = `${number}${FileSizeUnit}`;
declare type BlobType =
    | 'image'
    | 'video'
    | 'audio'
    | 'pdf'
    | 'csv'
    | 'text'
    | 'blob'
    | (string & Record<never, never>);

declare interface BlobUploadOptions {
    /**
     * The key to get the file/files from the request form.
     * @default 'files'
     */
    formKey?: string;
    /**
     * Whether to allow multiple files to be uploaded.
     * @default true
     */
    multiple?: boolean | number;
    /**
     * Options used for the ensure() method.
     */
    ensure?: BlobEnsureOptions;
    /**
     * The language in which the text message corresponds
     * @default true
     */
    lang?: string;
}

declare interface BlobEnsureOptions {
    /**
     * The maximum size of the blob (e.g. '1MB')
     */
    maxSize?: BlobSize;
    /**
     * The allowed types of the blob (e.g. ['image/png', 'application/json', 'video'])
     */
    types?: BlobType[];
}
