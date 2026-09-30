
export function verifyBusinessAppId(businessApp: string): boolean {
    const businessAppRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return businessAppRegex.test(businessApp);
}