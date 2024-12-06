const { PrismaClient } = require("@prisma/client");
const ClientError = require("../errors/ClientError");
const passport = require('passport');
const prisma = new PrismaClient();

const getUserById = async (req, res, next) => {
  try {
    const id = req.user.id;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const id = Array.from({ length: 21 }, () => Math.floor(Math.random() * 10)).join('');
    const saldo = 0;
    const isUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUser) {
      throw new ClientError("User already registered");
    }

    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        password,
        saldo,
      },
    });

    return res.status(201).json({
      message: "User added successfully",
      data: newUser,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { nama, fotoProfil, deskripsi  } = req.body;

    const isUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!isUser) {
      throw new ClientError("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        nama,
        fotoProfil,
        deskripsi
      },
    });

    return res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};

const GoogleCheck = async (req, res) => {
  try {
    console.log("id:", req.user.id);  
    console.log("email:", req.user.emails[0].value);

    const email = req.user.emails[0].value; 
    const id = req.user.id;

    const isUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUser) {
      return res.status(200).json({
        message: "Selamat Datang",
      });
    } else {
      const newUser = await prisma.user.create({
        data: {
          id,
          email,
        },
      });
  
      return res.status(201).json({
        message: 'User registered successfully',
        data: newUser,
      });


    }
  } catch (error) {
    console.error("Error in GoogleCheck:", error);
    res.status(500).send('Internal Server Error');
  }
};

const loginManual = async (req, res, next) => {
  passport.authenticate('local', (err, data, info) => {
    if (err) return next(err);
    if (!data) {
      return res.status(401).json({ message: info.message || 'Login failed' });
    }

    const { user, token } = data;

    res.json({
      message: 'Login successful',
      token, 
      user: {
        id: user.id,
        email: user.email,
      },
    });
  })(req, res, next);
};

const logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};


const googleCallback = (req, res, next) => {
  passport.authenticate('google', (err, data) => {
    if (err) return next(err);
    if (!data) {
      return res.status(401).json({ message: 'Google authentication failed' });
    }

    const { user, token } = data;

    res.json({
      message: 'Google authentication successful',
      token, 
      user: {
        id: user.id,
        email: user.email,
      },
    });
  })(req, res, next);
};


module.exports = {
  getUserById,
  register,
  updateProfile,
  GoogleCheck,
  loginManual,
  logout,
  googleCallback
};
