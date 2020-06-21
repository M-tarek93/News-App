export const fetchData = async (target, post = false) => {
  const res = await fetch(`http://localhost:5000/${target}`,{
    method: post ? 'POST' : 'GET',
    credentials: 'include'
  });
  return res.status === 200 ? await res.json() : [];
};

const fetchPost = async (target) => {
  const res = await fetch(`http://localhost:5000/${target}`,{
    method: 'POST',
    credentials: 'include'
  });
  return res.status === 200 ? true : false;
};

export const logout = async (setAuthenticated) => {
  const res = await fetchPost("auth/logout");
  if (res) {
    setAuthenticated(false);
    localStorage.clear();
  }
};

export const handleSubscription = async (id, action) => {
    const response = await fetchData(`news/${action}/${id}`, true);
    localStorage.setItem("sources", JSON.stringify(response));
}


export const checkAuthenticated = async () => {
  return await fetchPost("auth/checkAuth");
} 