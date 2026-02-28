export const compressImage = (file, maxWidth = 1920, quality = 0.8) =>
    new Promise((resolve, reject) => {
        // Check if the input is a valid File
        if (!(file instanceof File)) {
            reject(new Error("Input is not a valid File object."));
            return;
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };

        reader.onerror = (error) => {
            reject(error);
        };

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Canvas toBlob conversion failed."));
                        return;
                    }
                    // Create a new File object from the compressed Blob
                    const compressedFile = new File([blob], file.name, { type: file.type });
                    resolve(compressedFile);
                },
                file.type,
                quality
            );
        };

        img.onerror = (error) => {
            reject(error);
        };

        // Read the file as a Data URL to load into the image
        reader.readAsDataURL(file);
    });
