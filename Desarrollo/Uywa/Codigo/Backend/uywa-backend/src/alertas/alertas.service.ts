import { Injectable } from '@nestjs/common';

@Injectable()
export class AlertasService {
    getAlertas(): String[] {
        return ['Alerta 1', 'Alerta 2', 'Alerta 3'];
    }
}
