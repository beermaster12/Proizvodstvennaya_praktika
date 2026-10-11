<?php
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/db.php';

$gender = trim($_GET['gender'] ?? 'вся');
$type   = trim($_GET['type']   ?? 'вся');
$brand  = trim($_GET['brand']  ?? '');
$sort   = trim($_GET['sort']   ?? 'price_desc');

$allowedGenders = ['вся', 'женская', 'мужская'];
$allowedTypes   = ['вся', 'верхняя', 'обувь'];
$allowedBrands  = ['', 'CUN', 'MO', 'CR', 'RE', 'HO'];
$allowedSorts   = ['price_asc', 'price_desc'];

if (!in_array($gender, $allowedGenders, true)) $gender = 'вся';
if (!in_array($type,   $allowedTypes,   true)) $type   = 'вся';
if (!in_array($brand,  $allowedBrands,  true)) $brand  = '';
if (!in_array($sort,   $allowedSorts,   true)) $sort   = 'price_desc';

$where  = [];
$params = [];

if ($gender !== 'вся') {
    $where[] = 'gender = :gender';
    $params[':gender'] = $gender;
}
if ($type !== 'вся') {
    $where[] = 'type = :type';
    $params[':type'] = $type;
}
if ($brand !== '') {
    $where[] = 'brand = :brand';
    $params[':brand'] = $brand;
}


$orderMap = [
    'price_asc'  => 'price ASC',
    'price_desc' => 'price DESC',
];
$orderBy = $orderMap[$sort];

$sql = 'SELECT id, name, price, gender, type, brand, image FROM products';
if ($where) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}
$sql .= ' ORDER BY ' . $orderBy;

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

echo json_encode($products, JSON_UNESCAPED_UNICODE);

?>