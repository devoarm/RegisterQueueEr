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
import Typography from "@mui/material/Typography";
import { FetchGet, FetchPost } from "../utils/FetchApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { ListQueue } from "../interfaces/ListQueue";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { CardQueue } from "../components/CardQueue";
import { UrgencyType } from "../interfaces/UrgencyType";
import { ServicePointType } from "../interfaces/ServicePointType";

const rss: any = localStorage.getItem("servicePoints");
const service_points: any = JSON.parse(rss);

type Inputs = {
  hn: string;
};
interface IProps_Square {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const HomePage = () => {
  const [urgency, setUrgency] = useState("");
  const [selectServicePoint, setSelectServicePoint] = useState("");
  const [listQueue, setListQueue] = useState<ListQueue[]>([]);
  const [listUrgency, setListUrgency] = useState<UrgencyType[]>([]);

  const [servicePointList, setServicePointList] =
    useState<ServicePointType[]>(service_points);

  const [servicePoint, setServicePoint] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();
  const handleRegisQ: SubmitHandler<Inputs> = (data) => {
    let body = {
      hn: data.hn,
      servicePointId: servicePoint,
      priorityId: 11,
      urgency: urgency,
    };
    if (urgency != "" && servicePoint != "" && data.hn != "") {
      FetchPost(`/queue/prepare/register/er`, body).then((res: any) => {
        if (res.statusCode === 200) {
          console.log(res);
          FetchPost(`/print/queue/prepare/print/er`, {
            queueId: res.queue_er_id,
            topic: `/printer/${Cookies.get("printerId")}`,
            printSmallQueue: "N",
            urgency: urgency,
          }).then((res: any) => {
            if (res.statusCode === 200) {
              Swal.fire({
                icon: "success",
                title: "พิมพ์บัตรคิวสำเร็จ",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                reset();
                setUrgency("");
                fetchQueue(servicePoint);
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "พิมพ์คิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "สร้างคิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  function handleChange(event: SelectChangeEvent) {
    setUrgency(event.target.value as string);
  }
  const handleSearchErQueue = () => {
    FetchPost("/queue/search-er-queue", { query: getValues("hn") }).then(
      (res: any) => {
        setListQueue(res.results);
      }
    );
  };
  const handleChangeServicePoint = (event: SelectChangeEvent) => {
    setServicePoint(event.target.value as string);
    fetchQueue(event.target.value as string);
  };
  const fetchQueue = (servicePointParam: string) => {
    FetchGet(`/queue/list-register-er/${servicePointParam}`).then(
      (res: any) => {
        setListQueue(res.results);
      }
    );
  };
  const fetchUrgency = () => {
    FetchGet(`/service-points/urgency/type`).then((res: any) => {
      setListUrgency(res.results);
    });
  };
  useEffect(() => {
    fetchUrgency();
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
          <InputLabel id="demo-simple-select-filled-label">แผนก</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={servicePoint}
            onChange={(event) => handleChangeServicePoint(event)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {servicePointList.map((item: ServicePointType, index) => (
              <MenuItem key={index} value={item.service_point_id}>
                {item.service_point_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
            {listUrgency.map((item: UrgencyType) => (
              <MenuItem key={item.urgency_type_id} value={item.urgency_type_id}>
                {item.urgency_type_name} ({item.urgency_type_name_th})
              </MenuItem>
            ))}
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
              onClick={handleSearchErQueue}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
        {listQueue.map((item: ListQueue, index: number) => (
          <CardQueue
            key={index}
            queue_number={item.queue_number}
            hn={item.hn}
            title={item.title}
            first_name={item.first_name}
            last_name={item.last_name}
            queue_id={item.queue_er_id}
            urgency_id={item.urgency_type_id}
          />
        ))}
      </form>
    </div>
  );
};

export default HomePage;
