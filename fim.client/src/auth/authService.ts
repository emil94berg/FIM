import { supabase } from './supabaseClient';

export const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
};

export const signOut = async () => {
    await supabase.auth.signOut();
};

export const getToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
};