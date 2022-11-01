import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";
import { FetchGet, FetchPost } from "../utils/FetchApi";
import Cookies from "js-cookie";

interface Props {
  hn: string;
  queue_number: string;
  first_name: string;
  last_name: string;
  title: string;
  queue_id: number;
  urgency_id: number
}

export const CardQueue = (props: Props) => {
  const handlePrintQ = (
    e: React.MouseEvent<HTMLButtonElement>,
    queue_id?: number
  ) => {
    FetchPost(`/print/queue/prepare/print/er`, {
      queueId: queue_id,
      topic: `/printer/${Cookies.get("printerId")}`,
      printSmallQueue: "N",
      urgency: props.urgency_id,
    }).then((res: any) => {
      if (res.statusCode === 200) {
        Swal.fire({
          icon: "success",
          title: "พิมพ์บัตรคิวสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
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
  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 2, md: 3 }}
        >
          <Grid item md={10} sm={6} xs={7}>
            <Typography variant="h4">{props.queue_number}</Typography>
            <Typography>HN : {props.hn}</Typography>
            <Typography>{`${props.title}.${props.first_name} ${props.last_name}`}</Typography>
          </Grid>
          <Grid item md={2} sm={6} xs={5}>
            <Button variant="contained" size="large" fullWidth color="success" onClick={(e) => handlePrintQ(e, props.queue_id)}>
              พิมพ์บัตรคิว
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
