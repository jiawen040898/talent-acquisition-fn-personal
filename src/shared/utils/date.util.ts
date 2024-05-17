export const getDateWithMillisecondsOffset = (): Date => {
    const currentDate = new Date();
    return new Date(
        currentDate.setMilliseconds(currentDate.getMilliseconds() + 100),
    );
};
