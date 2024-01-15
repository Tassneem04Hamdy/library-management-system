export {};

declare global {
    namespace Express {
        interface Request {
            libraryId: string
        };
    };
};
