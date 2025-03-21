import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://nt-devconnector.onrender.com/api' }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => ({
        url: '/posts',
        method: 'GET',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      }),
    }),
  }),
});

export const { useGetPostsQuery, useDeletePostMutation } = postsApi;
