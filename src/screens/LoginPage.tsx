import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import DialogSetting from '../components/DialogSetting';
import Dialog from '@mui/material/Dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FetchLogin } from '../utils/AuthApi';
import Cookies from 'js-cookie'
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

type Inputs = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    FetchLogin('login', data).then((res: any) => {
      console.log(res);
      if (res.statusCode == 200) {
        Cookies.set('servicePoints',JSON.stringify(res.servicePoints))
        Cookies.set('token',res.token)
        navigate('/home');
      }
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            โรงพยาบาลอรัญประเทศ
          </Typography>
          <Button color="inherit" onClick={handleClickOpen}>
            ตั้งค่า
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogSetting handleClose={handleClose} />
      </Dialog>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              เข้าสู่ระบบ (สร้างคิว)
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="บัญชีผู้ใช้"
              autoComplete="email"
              autoFocus
              {...register('username', { required: true })}
            />
            {errors.username && <span>กรุณากรอกบัญชีผู้ใช้</span>}

            <TextField
              margin="normal"
              fullWidth
              label="รหัสผ่าน"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', { required: true })}
            />
            {errors.password && <span>กรุณากรอกบัญชีผู้ใช้</span>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              เข้าสู่ระบบ
            </Button>
          </Box>
        </form>
      </Container>
    </div>
  );
};

export default LoginPage;
