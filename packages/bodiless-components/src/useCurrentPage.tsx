const useCurrentPage = () => {
  // @TODO Enhance content node to this from the store.
  return window === undefined ? '' : window.location.pathname;
}

export default useCurrentPage;
