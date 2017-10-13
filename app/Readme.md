# cr_lens_control

### Температурные данные
Ext-js клиент для чтения данных с источников питания постоянного тока для ЛУ20.

Для загрузки данных по температуре БД должна содержаться таблица `extjs_controlroom`.`ws_rest_hosts` и `extjs_controlroom`.`devices_for_php_request`. SQL-скрипт для создания данной таблицы содержится в проекте cr_conf.

В таблицу `ws_rest_hosts` должны быть записаны следующие данные для `oil_temp_rest`

| ws_rest_host   |      name      |
|----------------|:--------------:|
| `hostname` и порт<br> REST сервера | `oil_temp_rest`|

Также в таблицу `devices_for_php_request` должны быть записаны данные для `oil_temp`

| alias   |      device_name      |
|----------------|:--------------:|
| `oil_temp` | имя девайса в одном из форматов<br> либо a/b/c<br> tango://host:port/a/b/c|

Ведётся запрос по URL `hostname`/tango/rest/rc4/hosts/`oil_temp_rest`/10000/devices/LU20/oil_termo/gr_oil/attributes/oil_temperature/value/plain