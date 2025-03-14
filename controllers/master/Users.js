import Users from '../models/UserModel.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

export const getAllUsers = async (req, res) => {
  try {
      const users = await Users.findAll();
      const response = {
          status_code: 200,
          message: "User data displayed successfully",
          payload: users
      };
      res.json(response);
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status_code: 500,
          message: "Internal server error",
          payload: []
      });
  }
};

export const getAllUsersByAccountType = async (req, res) => {
  const { account_type } = req.params;
  try {
      const users = await Users.findAll({ where: { account_type } });
      const response = {
          status_code: 200,
          message: "User data displayed successfully",
          payload: users
      };
      res.json(response);
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status_code: 500,
          message: "Internal server error",
          payload: []
      });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
      const user = await Users.findOne({ where: { id } });
      const response = {
          status_code: 200,
          message: "User data displayed successfully",
          payload: user
      };
      res.json(response);
  }
  catch (error) {
      console.error(error);
      res.status(500).json({
          status_code: 500,
          message: "Internal server error",
          payload: []
      });
  }
}

export const createUser = async (req, res) => {
  const { email, fullname, username, password, role, rpc, kebun, afdeling, account_type } = req.body;
  try {
      const user = await Users.create({
          id: uuidv4(),
          email,
          fullname,
          username,
          password,
          role,
          rpc,
          kebun,
          afdeling,
          account_type
      });
      const response = {
          status_code: 201,
          message: "User data created successfully",
          payload: user
      };
      res.status(201).json(response);
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status_code: 500,
          message: "Internal server error",
          payload: []
      });
  }
}


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, fullname, username, password, role, rpc, kebun, afdeling, account_type } = req.body;
  try {
      const user = await Users.update({
          email,
          fullname,
          username,
          password,
          role,
          rpc,
          kebun,
          afdeling,
          account_type
      }, { where: { id } });
      const response = {
          status_code: 200,
          message: "User data updated successfully",
          payload: user
      };
      res.json(response);
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status_code: 500,
          message: "Internal server error",
          payload: []
      });
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
      await Users.destroy({ where: { id } });
      const response = {
          status_code: 200,
          message: "User data deleted successfully",
          payload: []
      };
      res.json(response);
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status_code: 500,
          message: "Internal server error",
          payload: []
      });
  }
}

export const loginUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
              [Op.or]: [
                { email: req.body.identifier }, // Pencarian berdasarkan email
                { username: req.body.identifier } // Pencarian berdasarkan username
              ]
            }
          });
        if (!user) {
            return res.status(400).json({
                status_code: 400,
                message: "User not found"
            });
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(400).json({
                status_code: 400,
                message: "Invalid password"
            });
        }

        const accessToken = jwt.sign(
            { id: user.id, fullname: user.fullname, username: user.username, rpc: user.rpc, pks: user.pks, kebun: user.kebun, afd: user.afd, account_type: user.account_type, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5d" }
        );

        const refreshToken = jwt.sign(
            { id: user.id, fullname: user.fullname, username: user.username, rpc: user.rpc, pks: user.pks, kebun: user.kebun, afd: user.afd, account_type: user.account_type, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } // Add token expiration as needed
        );

        user.refreshToken = refreshToken;
        await user.save();


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });
        

        res.json({
            status_code: 200,
            message: "User logged in successfully",
            payload: {
                access_token: accessToken,
                token_type: "Bearer"
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status_code: 500,
            message: "Internal server error"
        });
    }
};



export const getMe = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await Users.findOne({
            where: { id: decoded.id },
            attributes: ['id','fullname','username','rpc','pks','kebun','afd','account_type','email','lastLogin','avatar', 'app_type', 'createdAt', 'updatedAt']
          });

        if (!user) {
            return res.status(404).json({ status_code: 404, message: 'User not found' });
        }
        res.json({ status_code: 200, payload: user });
    } catch (error) {
        console.error(error);
    }
};
