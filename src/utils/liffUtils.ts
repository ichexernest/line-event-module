import liff from "@line/liff";

export const getLiffUserId = async (): Promise<string> => {
  await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
  const profile = await liff.getProfile();
  return profile.userId;
};
