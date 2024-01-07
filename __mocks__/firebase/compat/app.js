const mockFirebase = {
    initializeApp: jest.fn(),
    auth: jest.fn(),
    firestore: jest.fn(),
    storage: jest.fn(),
    apps: {
        length: 0,
    },
};

export default mockFirebase;
