import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useForm, SubmitHandler } from "react-hook-form";
import Cookies from "js-cookie";
type Inputs = {
  apiUrl: string;
  printerId: string;
};

interface Props {
  handleClose: Function;
}

const DialogSetting = (props: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      apiUrl: Cookies.get('apiUrl'),
      printerId: Cookies.get('printerId'),
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    try {
      Cookies.set("apiUrl", data.apiUrl);
      Cookies.set("printerId", data.printerId);
      props.handleClose();
    } catch (error) {}
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle id="alert-dialog-title">{"การตั้งค่า"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            id="apiUrl"
            label="API URL"
            {...register("apiUrl", { required: true })}
            autoComplete="apiUrl"
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            id="printerId"
            label="PrinterID"
            {...register("printerId")}
            autoComplete="printerId"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.handleClose();
            }}
          >
            ยกเลิก
          </Button>
          <Button autoFocus type="submit">
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

export default DialogSetting;
