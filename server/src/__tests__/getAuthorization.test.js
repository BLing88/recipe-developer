import { getAuthorization } from "../getAuthorization";

jest.mock("../validate");
import { isTokenValid } from "../validate";

describe("getAuthorization", () => {
  test("returns true if valid access token", async () => {
    isTokenValid.mockReturnValueOnce({
      decoded: {
        iss: `https://${process.env.AUTH0_DOMAIN}/`,
        aud: [process.env.API_IDENTIFIER],
        exp: (Date.now() + 3600000) / 1000,
      },
    });

    const { isAuthorized } = await getAuthorization({
      accessToken: "fake token",
    });
    expect(isAuthorized).toBe(true);
  });

  test("returns false if errors validating access token", async () => {
    isTokenValid.mockReturnValueOnce({
      error: {
        message: "Some error message",
      },
    });

    const { isAuthorized } = await getAuthorization({
      accessToken: "fake token",
    });
    expect(isAuthorized).toBe(false);
  });

  test("returns false if access token has expired", async () => {
    isTokenValid.mockReturnValueOnce({
      decoded: {
        iss: `https://${process.env.AUTH0_DOMAIN}/`,
        aud: [process.env.API_IDENTIFIER],
        exp: (Date.now() - 3600000) / 1000,
      },
    });
    const { isAuthorized } = await getAuthorization({
      accessToken: "fake token",
    });
    expect(isAuthorized).toBe(false);
  });

  test("returns false if access token has incorrect issuer", async () => {
    isTokenValid.mockReturnValueOnce({
      decoded: {
        iss: `wrong https://${process.env.AUTH0_DOMAIN}/`,
        aud: [process.env.API_IDENTIFIER],
        exp: (Date.now() + 3600000) / 1000,
      },
    });
    const { isAuthorized } = await getAuthorization({
      accessToken: "fake token",
    });
    expect(isAuthorized).toBe(false);
  });

  test("returns false if access token has incorrect aud", async () => {
    isTokenValid.mockReturnValueOnce({
      decoded: {
        iss: `wrong https://${process.env.AUTH0_DOMAIN}/`,
        aud: [`wrong ${process.env.API_IDENTIFIER}`],
        exp: (Date.now() + 3600000) / 1000,
      },
    });
    const { isAuthorized } = await getAuthorization({
      accessToken: "fake token",
    });
    expect(isAuthorized).toBe(false);
  });
});
