/**
 * imgsrc and avatar property restrictions
 * While you can now edit the imgsrc and avatar properties, in order to provide safety to all Roll20's users we have put the following restrictions in place for those properties:
 * You must use an image file that has been uploaded to your Roll20 Library -- not an external site (such as Imgur), and not the Roll20 Marketplace. It will begin with 'https://s3.amazonaws.com/files.d20.io/images/' for images uploaded to the Main server, or 'https://s3.amazonaws.com/files.staging.d20.io/images/' for images uploaded to the Dev Server. You can view an image's source URL using the developer tools of your browser.
 * You must include the query string in the URL -- for example 'https://s3.amazonaws.com/files.staging.d20.io/images/123456/med.png?12345678', not just 'https://s3.amazonaws.com/files.staging.d20.io/images/123456/med.png'
 * For Graphic objects (tokens), you must use the "thumb" size of the image. It should look like 'https://s3.amazonaws.com/files.staging.d20.io/images/123456/thumb.png?12345678'.
 *
 * In the future we may add a tool so that images can be uploaded specifically for use with Mod (API) scripts, but for now just use images uploaded to your own library. Note that if you delete an image from your library, it will be removed from all Games which use that image, including Games using your Mod (API) scripts.
 */
export type AvatarImgSrc = string;
