﻿$(document).ready(function () {
//var socket = new WebSocket("ws://127.0.0.1:7890?login=tango&password=tango");
var socket = new WebSocket("ws://elkin-jinr.ddns.net:7890?login=tango&password=tango");
var test = 2;
var id = 0;

$("#test_butt").click(function () {
  argin = ['a','b','c'];
  
  argin = new Array();
  argin.push("sadsadsad");
  argin.push("bbbcjvhgdf");
  argin.push("1112");
  argin.push(25);
  
  argin = {};
  //argin.argin = [23,556,8886,333];
  argin.command = "DevShort";
  argin.id = id;
   argin.argin = 23;
  //socket.send("HELLLLOOOOOOOO");
  var sender = JSON.stringify(argin);
  socket.send(sender);
  console.log("but clicked");
  console.log("id= " + id);
    id++;
});

$("#massive_butt").click(function () {
  argin = {};
  argin.command = "DevVarShortArray";
  // argin.argin = [23,556,8886,333];
  // argin.id = id;
  
  //argin.command = "DevBoolean";
  argin.command = "DevVarCharArray";
  //argin.argin = "0";
  //argin.argin = [123,175,222];
  argin.command = "DevVarStringArray";
  argin.argin = ['aaa','bbb','ccc', 55];
  //argin.command = "DevUChar";
  //argin.argin = 66;
  //argin.id = id;
  var sender = JSON.stringify(argin);
  socket.send(sender);
  console.log("but clicked");
  console.log("id= " + id);
  id++;
});

$("#close_butt").click(function () {
  $("#test").append('Соединение закрыто');
  socket.close();
});


socket.onmessage = function(event) {
  //alert("Получены данные " + event.data);
  var fromJson = $.parseJSON(event.data);
  if (fromJson.command !== undefined || fromJson.error  !== undefined) {
  $("#out_from_server").html("Ответ: " + event.data + "<br><br>");
  } else
  $("#test").html("Получены данные " + event.data + "<br><br>");
  //console.log("Получены данные " + event.data);
};

socket.onerror = function(error) {
  $("#test").append("Ошибка " + error.message);
  socket.close();
};

socket.onclose = function(event) {
  if (event.wasClean) {
    $("#test").append('Соединение закрыто чисто');
    socket.close();
  } else {
    $("#test").append('Обрыв соединения'); // например, "убит" процесс сервера
    socket.close();
  }
  $("#test").append('Код: ' + event.code + ' причина: ' + event.reason);
  socket.close();
};
});