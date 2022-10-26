import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import mqtt from "precompiled-mqtt";
import { FetchGet, FetchPost } from "../utils/FetchApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { ListQueue } from "../interfaces/ListQueue";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { CardQueue } from "../components/CardQueue";

type Inputs = {
  hn: string;
};
interface IProps_Square {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const HomePage = () => {
  const [urgency, setUrgency] = useState("");
  const [listQueue, setListQueue] = useState<ListQueue[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const handleRegisQ: SubmitHandler<Inputs> = (data) => {
    let body = {
      hn: data.hn,
      servicePointId: 19,
      priorityId: 11,
    };
    FetchPost(`/queue/prepare/register/er`, body).then((res: any) => {
      if (res.statusCode === 200) {
        FetchPost(`/print/queue/prepare/print`, {
          queueId: res.queueId,
          topic: `/printer/${Cookies.get("printerId")}`,
          printSmallQueue: "N",
        }).then((res: any) => {
          if (res.statusCode === 200) {
            Swal.fire({
              icon: "success",
              title: "พิมพ์บัตรคิวสำเร็จ",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => reset());
          } else {
            Swal.fire({
              icon: "error",
              title: "ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  const handleChange = (event: SelectChangeEvent) => {
    setUrgency(event.target.value as string);
  };
  const fetchQueue = () => {
    FetchGet(`/queue/all-register/19`).then((res: any) => {
      setListQueue(res.results);
    });
  };
  useEffect(() => {
    fetchQueue();
    let client: mqtt.MqttClient = mqtt.connect("ws://192.168.3.229:8888", {
      username: "q4u",
      password: "##q4u##",
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });
    client.on("connect", () => {
      console.log("CONNECTED to broker");
    });
  }, []);
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            โรงพยาบาลอรัญประเทศ
          </Typography>
        </Toolbar>
      </AppBar>
      <form onSubmit={handleSubmit(handleRegisQ)}>
        <FormControl margin="normal" variant="filled" fullWidth>
          <InputLabel id="demo-simple-select-filled-label">
            ความเร่งด่วน
          </InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={urgency}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="สีแดง">Resuscitate (กู้ชีพทันที)</MenuItem>
            <MenuItem value="สีชมพู">Emergency (ฉุกเฉินเร่งด่วน)</MenuItem>
            <MenuItem value="สีเหลือง">Urgency (ด่วนมาก)</MenuItem>
            <MenuItem value="สีเขียว">Semi Urgency (ด่วน)</MenuItem>
            <MenuItem value="สีขาว">Non Urgency (รอได้)</MenuItem>
          </Select>
        </FormControl>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 2, md: 3 }}
        >
          <Grid item md={8} sm={6} xs={5}>
            <TextField
              margin="normal"
              fullWidth
              label="HN"
              type="text"
              {...register("hn")}
            />
          </Grid>
          <Grid item md={2} sm={3} xs={3}>
            <Button
              type="submit"
              onClick={handleSubmit(handleRegisQ)}
              variant="contained"
              size="large"
              fullWidth
            >
              สร้างคิว
            </Button>
          </Grid>
          <Grid item md={2} sm={3} xs={3}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              color="warning"
              onClick={() => reset()}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
        {listQueue.map((item: ListQueue, index: number) => (
          <CardQueue
            queue_number={item.queue_number}
            hn={item.hn}
            title={item.title}
            first_name={item.first_name}
            last_name={item.last_name}
            queue_id={item.queue_id}
          />          
        ))}
      </form>
    </div>
  );
};

export default HomePage;
