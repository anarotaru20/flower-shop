const supabase = require("../config/db");

async function register(req, res, next) {
  try {
    const { email, password, first_name, last_name, birth_date } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ message: "User could not be created" });
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        first_name,
        last_name,
        birth_date,
      })
      .eq("id", data.user.id);

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
            token_type: data.session.token_type,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
            token_type: data.session.token_type,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { access_token, refresh_token, password } = req.body;

    if (!access_token || !refresh_token || !password) {
      return res.status(400).json({
        message: "access_token, refresh_token and password are required",
      });
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError) {
      return res.status(400).json({ message: sessionError.message });
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
