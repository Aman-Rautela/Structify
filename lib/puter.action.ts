import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hosting";
import { isHostedUrl } from "./utils";

const getPuter = async () => {
    const { default: puter } = await import("@heyputer/puter.js");
    return puter;
};

export const signIn = async () => {
    const puter = await getPuter();
    return puter.auth.signIn();
};

export const signOut = async () => {
    const puter = await getPuter();
    return puter.auth.signOut();
};

export const getCurrentUser = async () => {
    try {
        const puter = await getPuter();
        return await puter.auth.getUser();
    } catch {
        return null;
    }
};

export const createProject = async ({
    item,
}: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    const projectId = item.id;

    let hosting: Awaited<ReturnType<typeof getOrCreateHostingConfig>>;
    let hostedSource: Awaited<ReturnType<typeof uploadImageToHosting>> | null = null;
    let hostedRender: Awaited<ReturnType<typeof uploadImageToHosting>> | null = null;

    try {
        hosting = await getOrCreateHostingConfig();

        hostedSource = projectId
            ? await uploadImageToHosting({ hosting, url: item.sourceImage, projectId, label: "source" })
            : null;

        hostedRender = projectId && item.renderedImage
            ? await uploadImageToHosting({ hosting, url: item.renderedImage, projectId, label: "rendered" })
            : null;
    } catch (error) {
        console.warn(`Failed to configure hosting or upload images: ${error}`);
        return null;
    }

    const resolvedSource =
        hostedSource?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage : "");

    if (!resolvedSource) {
        console.warn("Failed to host source image, skipping save.");
        return null;
    }

    const resolverRender = hostedRender?.url
        ? hostedRender.url
        : item.renderedImage && isHostedUrl(item.renderedImage)
          ? item.renderedImage
          : undefined;

    const { sourcePath: _s, renderedPath: _r, publicPath: _p, ...rest } = item;

    try {
        return { ...rest, sourceImage: resolvedSource, renderedImage: resolverRender };
    } catch (error) {
        console.log(`Failed to save project ${error}`);
        return null;
    }
};