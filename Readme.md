LensControl
===========

## Необходимые настройки для работы.

#### Данные с источников

Для нормальной работы БД `extjs_controlroom` должна содержать таблицу `ws_rest_hosts`  с необходимыми данными.
SQl dump таблицы можно найти в `cr_conf`

Для получения данных с источников в таблицу нужно записать URl для `wsforlens` (управляемый Вэбсокет) и для `wsforlens_ro` (вэбсокет в режиме readonly):

| ws_rest_host   |      name      |
|----------------|:--------------:|
| Url websocket с которого будут <br>считываться данные для LensControl (ReadOnly) | wsforlens_ro  |
| Url websocket с которого будут <br>считываться данные для LensControl |     wsforlens   |

#### Данные с термодатчиков

<b>старая версия!!!</b> Для получения данных с термодатчиков, нужно указать в файле `user_conf/oil_temp_conf.inc.php` следующие данные

```php
<?php
$mysqlhost = host or ip откуда будут качаться данные;
$dbuser = "username";
$dbpass = "password";
$dbname = Имя базы данных ... обычно это 'hdbpp';

$att_conf_id_min_tm2 = 14; // 
$att_conf_id_max_tm2 = 19; // 
?>
```

<b>Новая версия</b>
Либо, Для загрузки данных по температуре БД должна содержаться таблица `extjs_controlroom`.`ws_rest_hosts` и `extjs_controlroom`.`devices_for_php_request`. SQL-скрипт для создания данной таблицы содержится в проекте cr_conf.
      
      В таблицу `ws_rest_hosts` должны быть записаны следующие данные для `oil_temp_rest`
      
      | ws_rest_host   |      name      |
      |----------------|:--------------:|
      | `hostname` и порт<br> REST сервера | `oil_temp_rest`|
      
      Также в таблицу `devices_for_php_request` должны быть записаны данные для `oil_temp`
      
      | alias   |      device_name      |
      |----------------|:--------------:|
      | `oil_temp` | имя девайса в одном из форматов<br> либо a/b/c<br> tango://host:port/a/b/c|
      
      Ведётся запрос по URL `hostname`/tango/rest/rc4/hosts/`oil_temp_rest`/10000/devices/LU20/oil_termo/gr_oil/attributes/oil_temperature/value/plain

#### Сохранение установленных значений порогов

Пороги сохраняются в таблицу `saved_settings_in_json` БД `extjs_controlroom`. SQl dump таблицы можно найти в `cr_conf`. По умолчанию пороги можно сохранять, только если все источники включены (статус отличный от FAULT, красного цвета )

Данная таблица имеет следующую структуру:

| source   |      datetime      |  data_json | alias |
|----------------|:--------------:|:------:|:-----:|
| источник записи<br>Для разных источников разные имена | sql-datetime | данные в JSON-формате | имя записи |