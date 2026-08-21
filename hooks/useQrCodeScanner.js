import { useState, useEffect, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

/**
 * Hook para gerenciar o leitor de QR Code
 * @param {string} elementId - ID da div onde o leitor será renderizado
 * @param {function} onScanSuccess - Callback chamado quando um código é lido com sucesso
 */
const useQrCodeScanner = (elementId = "reader", onScanSuccess) => {
    const [isScanning, setIsScanning] = useState(false);

    // Funções para controle manual da câmera
    const startScanning = useCallback(() => setIsScanning(true), []);
    const stopScanning = useCallback(() => setIsScanning(false), []);
    const toggleScanning = useCallback(() => setIsScanning(prev => !prev), []);

    useEffect(() => {
        if (!isScanning) return;

        // Instancia a câmera apenas se o state for true
        const scanner = new Html5QrcodeScanner(
            elementId, 
            { fps: 10, qrbox: { width: 250, height: 250 } }, 
            false
        );

        scanner.render(
            (decodedText) => {
                // Passa o texto lido para o callback definido no componente pai
                if (onScanSuccess) {
                    onScanSuccess(decodedText);
                }
            },
            (errorMessage) => {
                // Erros de leitura contínua (podem ser ignorados silenciosamente)
            }
        );

        // Limpeza (unmount)
        return () => {
            scanner.clear().catch(error => console.error("Falha ao limpar o scanner:", error));
        };
    }, [isScanning, elementId, onScanSuccess]);

    return { 
        isScanning, 
        startScanning, 
        stopScanning, 
        toggleScanning 
    };
};

export default useQrCodeScanner;