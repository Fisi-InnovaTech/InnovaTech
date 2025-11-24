# Script usando curl.exe para 20 usuarios
$users = @(
    @{email="maria.gonzalez@email.com"; nombres="Maria"; apellidos="Gonzalez Lopez"; dni=71234567},
    @{email="carlos.rodriguez@email.com"; nombres="Carlos"; apellidos="Rodriguez Perez"; dni=72345678},
    @{email="ana.martinez@email.com"; nombres="Ana"; apellidos="Martinez Sanchez"; dni=73456789},
    @{email="javier.diaz@email.com"; nombres="Javier"; apellidos="Diaz Fernandez"; dni=74567890},
    @{email="laura.torres@email.com"; nombres="Laura"; apellidos="Torres Ramirez"; dni=75678901},
    @{email="miguel.garcia@email.com"; nombres="Miguel"; apellidos="Garcia Herrera"; dni=76789012},
    @{email="isabel.flores@email.com"; nombres="Isabel"; apellidos="Flores Mendoza"; dni=77890123},
    @{email="pedro.castillo@email.com"; nombres="Pedro"; apellidos="Castillo Rojas"; dni=78901234},
    @{email="elena.vargas@email.com"; nombres="Elena"; apellidos="Vargas Silva"; dni=79012345},
    @{email="rafael.ortiz@email.com"; nombres="Rafael"; apellidos="Ortiz Morales"; dni=70123456},
    @{email="claudia.ruiz@email.com"; nombres="Claudia"; apellidos="Ruiz Castro"; dni=81234567},
    @{email="andres.mendoza@email.com"; nombres="Andres"; apellidos="Mendoza Guerrero"; dni=82345678},
    @{email="patricia.hernandez@email.com"; nombres="Patricia"; apellidos="Hernandez Vega"; dni=83456789},
    @{email="oscar.jimenez@email.com"; nombres="Oscar"; apellidos="Jimenez Reyes"; dni=84567890},
    @{email="veronica.romero@email.com"; nombres="Veronica"; apellidos="Romero Navarro"; dni=85678901},
    @{email="fernando.morales@email.com"; nombres="Fernando"; apellidos="Morales Delgado"; dni=86789012},
    @{email="gabriela.rios@email.com"; nombres="Gabriela"; apellidos="Rios Paredes"; dni=87890123},
    @{email="roberto.soto@email.com"; nombres="Roberto"; apellidos="Soto Cordova"; dni=88901234},
    @{email="daniela.miranda@email.com"; nombres="Daniela"; apellidos="Miranda Salazar"; dni=89012345},
    @{email="jorge.perez@email.com"; nombres="Jorge"; apellidos="Perez Chavez"; dni=80123456}
)

foreach ($user in $users) {
    $jsonBody = @"
{
  "email": "$($user.email)",
  "password": "12345678",
  "nombres": "$($user.nombres)",
  "apellidos": "$($user.apellidos)",
  "dni": $($user.dni),
  "fechaNacimiento": "1990-01-15"
}
"@

    Write-Host "Creando usuario: $($user.email)" -ForegroundColor Yellow
    
    curl.exe --request POST `
      --url http://127.0.0.1:3000/auth/register `
      --header 'Content-Type: application/json' `
      --header 'User-Agent: insomnia/11.6.1' `
      --data "$jsonBody"
    
    Write-Host "Esperando 1 segundo..." -ForegroundColor Gray
    Start-Sleep -Seconds 1
}

Write-Host "Proceso completado! 20 usuarios creados." -ForegroundColor Cyan