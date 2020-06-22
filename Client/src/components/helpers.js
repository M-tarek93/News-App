// Fetching data and returning them in Json format
export const fetchData = async (target) => {
  const res = await fetch(`/${target}`,{
    credentials: 'include'
  });
  return res.status === 200 ? await res.json() : [];
};

// Used for submitting actions
export const fetchPost = async (target) => {
  const res = await fetch(`/${target}`,{
    method: 'POST',
    credentials: 'include'
  });
  return res.status === 200 ? true : false;
};

// Clearing cookies, and context when user log out
export const logout = async (setAuthenticated) => {
  const res = await fetchPost("auth/logout");
  if (res) setAuthenticated(false);
};

// Used to subscribe or unsubscribe from a source
export const handleSubscription = async (id, action) => {
    await fetchPost(`news/${action}/${id}`);
}

// Check if the user is logged in at the initial loading
export const checkAuthenticated = async () => {
  return await fetchPost("auth/checkAuth");
} 