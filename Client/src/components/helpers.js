export const fetchData = async (target) => {
  const res = await fetch(`http://localhost:5000/${target}`,{
    credentials: 'include'
  });
  return await res.json();
};

export const logout = async (setAuthenticated) => {
  await fetch("http://localhost:5000/auth/logout", {
    method: "POST",
    credentials: 'include'
  });
  setAuthenticated(false);
  localStorage.clear();
};

export const handleSubscription = async (id, action) => {
    const response = await fetchData(`news/${action}/${id}`);
    localStorage.setItem("sources", JSON.stringify(response));
}


export const checkAuthenticated = async () => {
  const res = await fetch('http://localhost:5000/auth/checkAuth',{
    credentials: 'include'
  });
  return res.status === 200 ? true : false;
} 