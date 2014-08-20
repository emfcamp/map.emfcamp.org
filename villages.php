<?php
header('Content-Type: application/json');

$data = file_get_contents('https://wiki.emfcamp.org/wiki/Special:Ask/-5B-5BCategory:Village-5D-5D/-3FLocation%3DVillage-20Location/-3FDescription%3DVillage-20Description/-3FPicture%3DImage/format%3Djson/offset%3D0');

# SMW I hate you.
$data = preg_replace('/"serializer": ".*",/', '', $data);
$data = preg_replace('/u([0-9A-F]{3,5})/', '\u\1', $data);
$data = preg_replace('/\\\\012/', '', $data);
print $data;

?>

