export const fetchData = async (currentView) => {
  await checkAccessTokenExpiry();
  const res = await fetch(`http://localhost:5000/${currentView}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
  });
  return await res.json();
};

export const checkAccessTokenExpiry = async () => {
  const expTime = localStorage.getItem("expAt");
  const now = Math.ceil(Date.now() / 1000);
  if (expTime > now + 4) return;
  else {
    const refreshToken = localStorage.getItem("refreshToken");
    const getNewToken = await fetch("http://localhost:5000/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await getNewToken?.json();
    const newAccessToken = res?.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("expAt", res?.expAt);
  }
};

export const logout = async (setUser) => {
  const refreshToken = localStorage.getItem("refreshToken");
  await fetch("http://localhost:5000/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  setUser();
  localStorage.clear();
};

export const handleSubscription = async (id, action, user, setUser) => {
    const response = await fetchData(`news/${action}/${id}`);
    const newUserData = {...user, sources: response}
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
}